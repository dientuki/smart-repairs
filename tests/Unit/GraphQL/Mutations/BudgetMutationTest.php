<?php

namespace Tests\Unit\GraphQL\Mutations;

use App\Enum\DiscountEnum;
use App\Models\Budget;
use App\Models\BudgetItem;
use App\Models\Discount;
use App\Models\Order;
use App\Models\Part;
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

    #[Test]
    public function update_existing_item_in_budget()
    {
        $randomPrice = number_format(rand(10, 1000) / 100, 2, '.', '');
        $q = 2;

        $Sj1 = ServiceJob::factory()->create([
            'price' => number_format(rand(900, 1000) / 100, 2, '.', ''),
            'team_id' => $this->team->id
        ]);
        $Sj2 = ServiceJob::factory()->create([
            'price' => number_format(rand(900, 1000) / 100, 2, '.', ''),
            'team_id' => $this->team->id
        ]);

        $order = Order::factory()->create([
            'team_id' => $this->team->id
        ]);

        $budget = Budget::factory()->create([
            'order_id' => $order->id,
            'team_id' => $this->team->id,
            'user_id' => Auth::user()->id,
            'subtotal' => $Sj1->price + $Sj2->price,
            'discount' => 0
        ]);
        $item1 = BudgetItem::factory()->create([
            'budget_id' => $budget->id,
            'itemable_id' => $Sj1->id,
            'itemable_type' => 'App\Models\ServiceJob',
            'quantity' => 1,
            'unit_price' => $Sj1->price,
            'item_total' => $Sj1->price,
            'include_in_sum' => true
        ]);
        $item2 = BudgetItem::factory()->create([
            'budget_id' => $budget->id,
            'itemable_id' => $Sj2->id,
            'itemable_type' => 'App\Models\ServiceJob',
            'quantity' => 1,
            'unit_price' => $Sj2->price,
            'item_total' => $Sj2->price,
            'include_in_sum' => true
        ]);

        $part = Part::factory()->create();

        $response = $this->graphQL('
            mutation {
                updateBudget(
                    orderId: "' . $order->id . '"
                    budgetItems: [
                    {
                        id: "' . $item1->id . '",
                        itemableId: "' . $Sj1->id . '",
                        itemableType: "App\\\\Models\\\\ServiceJob",
                        quantity: 1,
                        unitPrice: ' . $Sj1->price . ',
                        includeInSum: true
                    },
                    {
                        id: "' . $item2->id . '",
                        itemableId: "' . $part->id . '",
                        itemableType: "App\\\\Models\\\\Part",
                        quantity: ' . $q . ',
                        unitPrice: ' . $randomPrice . ',
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

        $this->assertDatabaseHas('budgets', [
            'order_id' => $order->id, // Asegúrate de usar el ID correcto para el presupuesto
            'subtotal' => $Sj1->price + ($randomPrice * $q),
            'discount' => 0,
        ]);

        $response->assertJson([
            'data' => [
                'updateBudget' => [
                    '__typename' => 'UpdateBudgetPayload',
                    'success' => true,
                ],
            ],
        ]);

        $this->assertDatabaseCount('budget_items', 2);

        $this->assertDatabaseHas('budget_items', [
            'id' => $item2->id,
            'itemable_id' => $part->id,
            'itemable_type' => 'App\Models\Part',
            'item_total' => $randomPrice * $q,
            'quantity' => $q
        ]);
    }

    #[Test]
    public function add_item_to_existing_budget()
    {
        $Sj1 = ServiceJob::factory()->create([
            'price' => number_format(rand(900, 1000) / 100, 2, '.', ''),
            'team_id' => $this->team->id
        ]);

        $order = Order::factory()->create([
            'team_id' => $this->team->id
        ]);

        $budget = Budget::factory()->create([
            'order_id' => $order->id,
            'team_id' => $this->team->id,
            'user_id' => Auth::user()->id,
            'subtotal' => $Sj1->price,
            'discount' => 0
        ]);

        $item1 = BudgetItem::factory()->create([
            'budget_id' => $budget->id,
            'itemable_id' => $Sj1->id,
            'itemable_type' => 'App\Models\ServiceJob',
            'quantity' => 1,
            'unit_price' => $Sj1->price,
            'item_total' => $Sj1->price,
            'include_in_sum' => true
        ]);


        $part = Part::factory()->create();
        $randomPrice = number_format(rand(10, 1000) / 100, 2, '.', '');
        $q = 2;

        $response = $this->graphQL('
            mutation {
                updateBudget(
                    orderId: "' . $order->id . '"
                    budgetItems: [
                    {
                        id: "' . $item1->id . '",
                        itemableId: "' . $Sj1->id . '",
                        itemableType: "App\\\\Models\\\\ServiceJob",
                        quantity: 1,
                        unitPrice: ' . $Sj1->price . ',
                        includeInSum: true
                    },
                    {
                        id: "",
                        itemableId: "' . $part->id . '",
                        itemableType: "App\\\\Models\\\\Part",
                        quantity: ' . $q . ',
                        unitPrice: ' . $randomPrice . ',
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

        $this->assertDatabaseHas('budgets', [
            'order_id' => $order->id, // Asegúrate de usar el ID correcto para el presupuesto
            'subtotal' => $Sj1->price + ($randomPrice * $q),
            'discount' => 0,
        ]);

        $response->assertJson([
            'data' => [
                'updateBudget' => [
                    '__typename' => 'UpdateBudgetPayload',
                    'success' => true,
                ],
            ],
        ]);

        $this->assertDatabaseCount('budget_items', 2);

        $this->assertDatabaseHas('budget_items', [
            'budget_id' => $budget->id,
            'itemable_id' => $part->id,
            'itemable_type' => 'App\Models\Part',
            'item_total' => $randomPrice * $q,
            'quantity' => $q
        ]);
    }

    #[Test]
    public function replace_item_in_existing_budget()
    {
        $randomPrice = number_format(rand(10, 1000) / 100, 2, '.', '');
        $q = 2;

        $Sj1 = ServiceJob::factory()->create([
            'price' => number_format(rand(900, 1000) / 100, 2, '.', ''),
            'team_id' => $this->team->id
        ]);
        $Sj2 = ServiceJob::factory()->create([
            'price' => number_format(rand(900, 1000) / 100, 2, '.', ''),
            'team_id' => $this->team->id
        ]);

        $order = Order::factory()->create([
            'team_id' => $this->team->id
        ]);

        $budget = Budget::factory()->create([
            'order_id' => $order->id,
            'team_id' => $this->team->id,
            'user_id' => Auth::user()->id,
            'subtotal' => $Sj1->price + $Sj2->price,
            'discount' => 0
        ]);
        $item1 = BudgetItem::factory()->create([
            'budget_id' => $budget->id,
            'itemable_id' => $Sj1->id,
            'itemable_type' => 'App\Models\ServiceJob',
            'quantity' => 1,
            'unit_price' => $Sj1->price,
            'item_total' => $Sj1->price,
            'include_in_sum' => true
        ]);
        $item2 = BudgetItem::factory()->create([
            'budget_id' => $budget->id,
            'itemable_id' => $Sj2->id,
            'itemable_type' => 'App\Models\ServiceJob',
            'quantity' => 1,
            'unit_price' => $Sj2->price,
            'item_total' => $Sj2->price,
            'include_in_sum' => true
        ]);

        $part = Part::factory()->create();

        $response = $this->graphQL('
            mutation {
                updateBudget(
                    orderId: "' . $order->id . '"
                    budgetItems: [
                    {
                        id: "' . $item1->id . '",
                        itemableId: "' . $Sj1->id . '",
                        itemableType: "App\\\\Models\\\\ServiceJob",
                        quantity: 1,
                        unitPrice: ' . $Sj1->price . ',
                        includeInSum: true
                    },
                    {
                        id: "",
                        itemableId: "' . $part->id . '",
                        itemableType: "App\\\\Models\\\\Part",
                        quantity: ' . $q . ',
                        unitPrice: ' . $randomPrice . ',
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

        $this->assertDatabaseHas('budgets', [
            'order_id' => $order->id, // Asegúrate de usar el ID correcto para el presupuesto
            'subtotal' => $Sj1->price + ($randomPrice * $q),
            'discount' => 0,
        ]);

        $response->assertJson([
            'data' => [
                'updateBudget' => [
                    '__typename' => 'UpdateBudgetPayload',
                    'success' => true,
                ],
            ],
        ]);

        $this->assertDatabaseCount('budget_items', 2);

        $this->assertDatabaseHas('budget_items', [
            'itemable_id' => $part->id,
            'itemable_type' => 'App\Models\Part',
            'item_total' => $randomPrice * $q,
            'quantity' => $q
        ]);
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
