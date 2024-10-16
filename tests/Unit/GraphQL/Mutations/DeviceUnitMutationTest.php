<?php

namespace Tests\Unit\GraphQL\Mutations;

use App\Enum\DiscountEnum;
use App\Enum\UnlockEnum;
use App\Models\Brand;
use App\Models\Budget;
use App\Models\BudgetItem;
use App\Models\Device;
use App\Models\DeviceType;
use App\Models\Discount;
use App\Models\Order;
use App\Models\Part;
use App\Models\ServiceJob;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Unit\GraphQL\TestCaseGraphQL;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Support\Facades\Auth;
use Faker\Factory;

class DeviceUnitMutationTest extends TestCaseGraphQL
{
    use RefreshDatabase;
    use MakesGraphQLRequests;

    #[Test]
    public function create_device_unit_from_scratch()
    {

        $faker = Factory::create();
        $brand = $faker->word;
        $type = $faker->word;
        $commercial_name = $faker->words(2, true);
        $url = $faker->url;

        $response = $this->graphQL('
            mutation {
                addTemporaryDeviceUnit(
                    input: {
                        deviceid: "",
                        brandid: "",
                        brandlabel: "' . $brand . '"
                        typeid: ""
                        typelabel: "' . $type . '"
                        commercialname: "' . $commercial_name . '"
                        url: "' . $url . '"

                        unlocktype: "' . UnlockEnum::None->value . '"
                        unlockcode: ""
                        serialid: ""
                        seriallabel: ""
                        versionid: ""
                        versionlabel: ""
                    }
                ) {
                    __typename
                    ... on TemporaryDeviceUnitPayload {
                        temporarydeviceunit
                        status
                        brand {
                            id
                            label
                        }
                        deviceType {
                            id
                            label
                        }
                        device {
                            id
                            commercial_name
                            url
                            brand {
                                id
                                name
                            }
                            deviceType {
                                id
                                name
                            }
                        }
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
                'addTemporaryDeviceUnit' => [
                    '__typename' => 'TemporaryDeviceUnitPayload',
                    'status' => true,
                    'brand' => [
                        'label' => $brand,
                    ],
                    'deviceType' => [
                        'label' => $type,
                    ],
                    'device' => [
                        'commercial_name' => $commercial_name,
                        'url' => $url,
                        'brand' => [
                            'name' => $brand,
                        ],
                        'deviceType' => [
                            'name' => $type,
                        ],
                    ],
                ],
            ],
        ]);

        $this->assertDatabaseHas('brands', [
            'name' => $brand
        ]);
        $this->assertDatabaseHas('device_types', [
            'name' => $type
        ]);
        $this->assertDatabaseHas('devices', [
            'commercial_name' => $commercial_name,
            'url' => $url,
            'brand_id' => $response->json()['data']['addTemporaryDeviceUnit']['device']['brand']['id'],
            'device_type_id' => $response->json()['data']['addTemporaryDeviceUnit']['device']['deviceType']['id'],
        ]);
        $this->assertDatabaseHas('temporary_device_units', [
            'id' => $response->json()['data']['addTemporaryDeviceUnit']['temporarydeviceunit'],
            'device_id' => $response->json()['data']['addTemporaryDeviceUnit']['device']['id'],
        ]);
    }

    #[Test]
    public function update_brand_and_device_type_and_device()
    {

        $faker = Factory::create();
        $brand = Brand::factory()->create();
        $type = DeviceType::factory()->create();
        $device = Device::factory()->create(['brand_id' => $brand->id, 'device_type_id' => $type->id]);

        $newData = [
            'brand' => $faker->word(),
            'type' => $faker->word(),
            'commercial_name' => $faker->word(2, true),
            'url' => $faker->url
        ];

        $response = $this->graphQL('
            mutation {
                addTemporaryDeviceUnit(
                    input: {
                        deviceid: "' . $device->id . '",
                        brandid: "' . $brand->id . '",
                        brandlabel: "' . $newData['brand'] . '"
                        typeid: "' . $type->id . '"
                        typelabel: "' . $newData['type'] . '"
                        commercialname: "' . $newData['commercial_name'] . '"
                        url: "' . $newData['url'] . '"

                        unlocktype: "' . UnlockEnum::None->value . '"
                        unlockcode: ""
                        serialid: ""
                        seriallabel: ""
                        versionid: ""
                        versionlabel: ""
                    }
                ) {
                    __typename
                    ... on TemporaryDeviceUnitPayload {
                        temporarydeviceunit
                        status
                        brand {
                            id
                            label
                        }
                        deviceType {
                            id
                            label
                        }
                        device {
                            id
                            commercial_name
                            url
                            brand {
                                id
                                name
                            }
                            deviceType {
                                id
                                name
                            }
                        }
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
                'addTemporaryDeviceUnit' => [
                    '__typename' => 'TemporaryDeviceUnitPayload',
                    'status' => true,
                    'brand' => [
                        'id' => $brand->id,
                        'label' => $newData['brand'],
                    ],
                    'deviceType' => [
                        'id' => $type->id,
                        'label' => $newData['type'],
                    ],
                    'device' => [
                        'id' => $device->id,
                        'commercial_name' => $newData['commercial_name'],
                        'url' => $newData['url'],
                        'brand' => [
                            'id' => $brand->id,
                            'name' => $newData['brand'],
                        ],
                        'deviceType' => [
                            'id' => $type->id,
                            'name' => $newData['type'],
                        ],
                    ],
                ],
            ],
        ]);

        $this->assertDatabaseHas('brands', [
            'id' => $brand->id,
            'name' => $newData['brand']
        ]);
        $this->assertDatabaseHas('device_types', [
            'id' => $type->id,
            'name' => $newData['type']
        ]);
        $this->assertDatabaseHas('devices', [
            'id' => $device->id,
            'commercial_name' => $newData['commercial_name'],
            'url' => $newData['url'],
            'brand_id' => $brand->id,
            'device_type_id' => $type->id,
        ]);
        $this->assertDatabaseHas('temporary_device_units', [
            'id' => $response->json()['data']['addTemporaryDeviceUnit']['temporarydeviceunit'],
            'device_id' => $response->json()['data']['addTemporaryDeviceUnit']['device']['id'],
        ]);
    }

    /*
    #[Test]
    public function cannot_send_invalid_form()
    {
        //01J91PEZV6WS7FQBQW9WHKNDCM
        $response = $this->graphQL('
            mutation {
                addTemporaryDeviceUnit(
                    input: {
                        deviceid: "invalid-ulid"
                        brandid: "invalid-ulid"
                        typeid: "invalid-ulid"
                        url: "invalid-url"

                        serialid: "invalid-ulid"
                        versionid: "invalid-ulid"
                    }
                ) {
                    __typename
                    ... on TemporaryDeviceUnitPayload {
                        temporarydeviceunit
                    }
                    ... on ErrorPayload {
                        status
                        i18nKey
                    }
                }
            }
        ');

        $response->assertJsonStructure([
            'errors' => [
                [
                    'message',
                    'extensions' => [
                        'validation' => [
                            'input.deviceid',
                            'input.brandid',
                            'input.typeid',
                            'input.url',
                            'input.serialid',
                            'input.versionid',
                            'input.commercialname',
                            'input.unlocktype',
                        ],
                    ],
                ],
            ],
          ]);

        $response = $this->graphQL('
          mutation {
              addTemporaryDeviceUnit(
                  input: {
                      deviceid: "01J91PEZV6WS7FQBQW9WHKNDCM"
                      brandid: "01J91PEZV6WS7FQBQW9WHKNDCM"
                      typeid: "01J91PEZV6WS7FQBQW9WHKNDCM"
                      commercialname: "dummy"

                      unlocktype: "invalid-code"
                      serialid: "01J91PEZV6WS7FQBQW9WHKNDCM"
                      versionid: "01J91PEZV6WS7FQBQW9WHKNDCM"
                  }
              ) {
                  __typename
                  ... on TemporaryDeviceUnitPayload {
                      temporarydeviceunit
                  }
                  ... on ErrorPayload {
                      status
                      i18nKey
                  }
              }
          }
      ');

        $response->assertJsonStructure([
          'errors' => [
              [
                  'message',
                  'extensions' => [
                      'validation' => [
                          'input.deviceid',
                          'input.brandid',
                          'input.typeid',
                          'input.unlocktype',
                          'input.versionid',
                      ],
                  ],
              ],
          ],
        ]);

        $brand = Brand::factory()->create();
        $type = DeviceType::factory()->create();
        $device = Device::factory()->create(['brand_id' => $brand->id, 'device_type_id' => $type->id]);

        $response = $this->graphQL('
          mutation {
              addTemporaryDeviceUnit(
                  input: {
                      deviceid: ""
                      commercialname: "dummy"
                      unlocktype: "code"
                  }
              ) {
                  __typename
                  ... on TemporaryDeviceUnitPayload {
                      temporarydeviceunit
                  }
                  ... on ErrorPayload {
                      status
                      i18nKey
                  }
              }
          }
      ');

        $response->assertJsonStructure([
        'errors' => [
            [
                'message',
                'extensions' => [
                    'validation' => [
                        'input.unlockcode',
                    ],
                ],
            ],
        ],
        ]);
    }
    */

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
