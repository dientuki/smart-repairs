<?php

namespace Tests\Unit\GraphQL\Mutations;

use App\Enum\DiscountEnum;
use App\Models\Budget;
use App\Models\BudgetItem;
use App\Models\Discount;
use App\Models\Order;
use App\Models\ServiceJob;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Unit\GraphQL\TestCaseGraphQL;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Support\Facades\Auth;

class BudgetMutationTest extends TestCaseGraphQL
{
    use RefreshDatabase;
    use MakesGraphQLRequests;

    #[Test]
    public function create_budget_with_service_job()
    {
        $randomPrice = number_format(rand(10, 1000) / 100, 2, '.', '');
        $serviceJob = ServiceJob::factory()->create([
            'price' => $randomPrice,
            'team_id' => $this->team->id
        ]);

        $order = Order::factory()->create([
            'team_id' => $this->team->id
        ]);

        $response = $this->graphQL('
            mutation {
                updateBudget(
                    orderId: "' . $order->id . '"
                    budgetItems: [{
                        id: "",
                        itemableId: "' . $serviceJob->id . '",
                        itemableType: "App\\\\Models\\\\ServiceJob",
                        quantity: 1,
                        unitPrice: ' . $randomPrice . ',
                        includeInSum: true
                    }]
                ) {
                    __typename
                    ... on UpdateBudgetPayload {
                        success
                    }
                    ... on ErrorPayload {
                        status
                        i18nKey
                    }
                }
            }
        ');

        $response->assertJson([
            'data' => [
                'updateBudget' => [
                    '__typename' => 'UpdateBudgetPayload',
                    'success' => true,
                ],
            ],
        ]);

        $this->assertDatabaseHas('budgets', [
            'order_id' => $order->id, // Asegúrate de usar el ID correcto para el presupuesto
            'subtotal' => $randomPrice,
            'discount' => 0,
        ]);

        $this->assertDatabaseCount('budget_items', 1);
    }

    #[Test]
    public function cannot_create_budget_with_service_job_quantity_not_one()
    {
        $randomPrice = number_format(rand(10, 1000) / 100, 2, '.', '');
        $serviceJob = ServiceJob::factory()->create([
            'price' => $randomPrice,
            'team_id' => $this->team->id
        ]);

        $order = Order::factory()->create([
            'team_id' => $this->team->id
        ]);

        $response = $this->graphQL('
            mutation {
                updateBudget(
                    orderId: "' . $order->id . '"
                    budgetItems: [{
                        id: "",
                        itemableId: "' . $serviceJob->id . '",
                        itemableType: "App\\\\Models\\\\ServiceJob",
                        quantity: 2,
                        unitPrice: ' . $randomPrice . ',
                        includeInSum: true
                    }]
                ) {
                    __typename
                    ... on UpdateBudgetPayload {
                        success
                    }
                    ... on ErrorPayload {
                        status
                        i18nKey
                    }
                }
            }
        ');

        $response->assertJson([
            'data' => [
                'updateBudget' => [
                    '__typename' => 'ErrorPayload',
                    'status' => false,
                    'i18nKey' => 'budget.error.quantity'
                ],
            ],
        ]);
    }

    #[Test]
    public function cannot_create_budget_with_discount_quantity_not_one()
    {
        $randomPrice = number_format(rand(10, 1000) / 100, 2, '.', '');
        $discount = Discount::factory()->create([
            'price' => $randomPrice,
            'team_id' => $this->team->id
        ]);

        $order = Order::factory()->create([
            'team_id' => $this->team->id
        ]);

        $response = $this->graphQL('
            mutation {
                updateBudget(
                    orderId: "' . $order->id . '"
                    budgetItems: [{
                        id: "",
                        itemableId: "' . $discount->id . '",
                        itemableType: "App\\\\Models\\\\Discount",
                        quantity: 2,
                        unitPrice: ' . $randomPrice . ',
                        includeInSum: true
                    }]
                ) {
                    __typename
                    ... on UpdateBudgetPayload {
                        success
                    }
                    ... on ErrorPayload {
                        status
                        i18nKey
                    }
                }
            }
        ');

        $response->assertJson([
            'data' => [
                'updateBudget' => [
                    '__typename' => 'ErrorPayload',
                    'status' => false,
                    'i18nKey' => 'budget.error.quantity'
                ],
            ],
        ]);
    }

    #[Test]
    public function create_budget_with_service_job_and_discount_fixed()
    {
        $serviceJob = ServiceJob::factory()->create([
            'price' => number_format(rand(900, 1000) / 100, 2, '.', ''),
            'team_id' => $this->team->id
        ]);
        $discount = Discount::factory()->create([
            'price' => number_format(rand(100, 200) / 100, 2, '.', ''),
            'team_id' => $this->team->id
        ]);

        $order = Order::factory()->create([
            'team_id' => $this->team->id
        ]);

        $response = $this->graphQL('
            mutation {
                updateBudget(
                    orderId: "' . $order->id . '"
                    budgetItems: [
                    {
                        id: "",
                        itemableId: "' . $serviceJob->id . '",
                        itemableType: "App\\\\Models\\\\ServiceJob",
                        quantity: 1,
                        unitPrice: ' . $serviceJob->price . ',
                        includeInSum: true
                    },
                    {
                        id: "",
                        itemableId: "' . $discount->id . '",
                        itemableType: "App\\\\Models\\\\Discount",
                        quantity: 1,
                        unitPrice: ' . $discount->price . ',
                        includeInSum: true
                    }
                    ]
                ) {
                    __typename
                    ... on UpdateBudgetPayload {
                        success
                    }
                    ... on ErrorPayload {
                        status
                        i18nKey
                    }
                }
            }
        ');

        $response->assertJson([
            'data' => [
                'updateBudget' => [
                    '__typename' => 'UpdateBudgetPayload',
                    'success' => true,
                ],
            ],
        ]);

        $this->assertDatabaseHas('budgets', [
            'order_id' => $order->id, // Asegúrate de usar el ID correcto para el presupuesto
            'subtotal' => $serviceJob->price,
            'discount' => $discount->price,
        ]);

        $this->assertDatabaseCount('budget_items', 2);
    }

    #[Test]
    public function create_budget_with_service_job_and_discount_percentage()
    {
        $serviceJob = ServiceJob::factory()->create([
            'price' => 100, //number_format(rand(900,1000) / 100, 2, '.', ''),
            'team_id' => $this->team->id
        ]);
        $discount = Discount::factory()->create([
            'price' => 8, //number_format(rand(5,99) / 100, 0, '.', ''),
            'team_id' => $this->team->id,
            'type' => DiscountEnum::Percentage
        ]);

        $order = Order::factory()->create([
            'team_id' => $this->team->id
        ]);

        $response = $this->graphQL('
            mutation {
                updateBudget(
                    orderId: "' . $order->id . '"
                    budgetItems: [
                    {
                        id: "",
                        itemableId: "' . $serviceJob->id . '",
                        itemableType: "App\\\\Models\\\\ServiceJob",
                        quantity: 1,
                        unitPrice: ' . $serviceJob->price . ',
                        includeInSum: true
                    },
                    {
                        id: "",
                        itemableId: "' . $discount->id . '",
                        itemableType: "App\\\\Models\\\\Discount",
                        quantity: 1,
                        unitPrice: ' . $discount->price . ',
                        includeInSum: true
                    }
                    ]
                ) {
                    __typename
                    ... on UpdateBudgetPayload {
                        success
                    }
                    ... on ErrorPayload {
                        status
                        i18nKey
                    }
                }
            }
        ');

        $response->assertJson([
            'data' => [
                'updateBudget' => [
                    '__typename' => 'UpdateBudgetPayload',
                    'success' => true,
                ],
            ],
        ]);

        $discountValue = round((($serviceJob->price * $discount->price) / 100), 2);

        $this->assertDatabaseHas('budgets', [
            'order_id' => $order->id, // Asegúrate de usar el ID correcto para el presupuesto
            'subtotal' => $serviceJob->price,
            'discount' => $discountValue,
        ]);

        $budget = Budget::where('order_id', $order->id)->firstOrFail();

        $this->assertDatabaseHas('budget_items', [
            'budget_id' => $budget->id, // Asegúrate de usar el ID correcto para el presupuesto
            'itemable_id' => $discount->id,
            'item_total' => $discountValue,
        ]);

        $this->assertDatabaseCount('budget_items', 2);
    }

    /**
     * Test to ensure that an unauthenticated user cannot access the mutation.
     *
     * @return void
     */
    #[Test]
    public function user_not_authenticated_cannot_access()
    {
        $query = '
            mutation {
                addCustomer(customer: {
                    firstname: "John",
                    lastname: "Doe",
                    phone: "+123456789",
                    email: "john.doe@example.com"
                }) {
                    id
                }
            }
        ';

        $this->assertUserNotAuthenticated($query);
    }
}
