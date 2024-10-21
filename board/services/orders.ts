import { arrayToString } from "@/helper/stringHelpers";
import {
  graphqlRequest,
  handleGraphQLErrors,
  handlePayloadErrors,
} from "@/helper/graphqlHelpers";
import { TypedColumn } from "@/types/enums";

export const createOrder = async (
  orderTable,
  orderChecksTable,
  tmpDeviceUnitTable,
  money,
  items,
) => {
  const response = await graphqlRequest(`
                        mutation {
                            addOrder(
                              order: {
                                customer: "${orderTable.customer}"
                                observation: "${orderTable.observation}"
                              },
                              orderChecks: {
                                damages: ${arrayToString(orderChecksTable.damages)}
                                features: ${arrayToString(orderChecksTable.features)}
                                damagesdescription: "${orderChecksTable.damagesDescription}"
                                featuresdescription: "${orderChecksTable.featuresDescription}"
                              },
                              tmpDeviceUnit: {
                                device: "${tmpDeviceUnitTable.device}"
                                deviceversion: "${tmpDeviceUnitTable.deviceVersion}"
                                deviceunit: "${tmpDeviceUnitTable.deviceUnit}"
                                unlockcode: "${tmpDeviceUnitTable.unlockCode}"
                                unlocktype: "${tmpDeviceUnitTable.unlockType}"
                                serial: "${tmpDeviceUnitTable.serial}"
                              },
                              money: ${money},
                              budgetItems: ${arrayToString(items)}
                            ) {
                              __typename
                              ... on AddOrderPayload {
                                success
                                order
                              }
                              ... on ErrorPayload {
                                status
                                i18nKey
                              }
                            }
                    }
                `);

  handleGraphQLErrors(response.errors);
  handlePayloadErrors(response.data.addOrder);

  return response.data.addOrder;
};

export const getOrder = async (id: string) => {
  const response = await graphqlRequest(`
        query {
            order(id: "${id}") {
                id
                status
                created_at
                observation
                hasBudget
                diagnosis

                creator {
                    name
                    imageUrl
                }
                assignee {
                    name
                    imageUrl
                }

                customer {
                    label
                    phone
                }

                comments {
                    id
                    comment
                    created_at
                    is_public
                    user_id
                    was_edited
                    user {
                        name
                        imageUrl
                    }
                }

                device {
                    commercial_name
                    brand {
                        name
                        imageUrl
                    }
                    deviceType {
                        name
                        imageUrl
                    }
                }

                deviceUnit {
                    id
                    serial
                    unlock_type
                    unlock_code
                    deviceVersion {
                        version
                    }
                }

                budget {
                  total
                }

                payments {
                  amount
                  created_at
                }

                orderCheck {
                  damages
                  damages_description
                  features
                  features_description
                }
            }
        }
    `);

  handleGraphQLErrors(response.errors);

  const comments: OrderComment[] = response.data.order.comments.reduce(
    (acc: OrderComment[], comment: RawOrderComment) => [
      {
        id: comment.id,
        comment: comment.comment,
        createdAt: comment.created_at,
        createdAtDate: new Date(comment.created_at),
        isPublic: comment.is_public,
        userId: comment.user_id,
        userName: comment.user.name,
        userImage: comment.user.imageUrl,
        wasEdited: comment.was_edited,
      },
      ...acc,
    ],
    [],
  );

  return {
    $id: response.data.order.id,
    createdAt: response.data.order.created_at,
    createdAtDate: new Date(response.data.order.created_at),
    creator: response.data.order.creator.name,
    creatorAvatar: response.data.order.creator.imageUrl,
    assignee: response.data.order.assignee?.name,
    assigneeAvatar: response.data.order.assignee?.imageUrl,
    diagnosis: response.data.order.diagnosis,
    status: response.data.order.status,
    brand: response.data.order.device.brand.name,
    brandImage: response.data.order.device.brand.imageUrl,
    deviceUnitId: response.data.order.deviceUnit?.id,
    deviceUnlockCode: response.data.order.deviceUnit?.unlock_code,
    deviceUnlockType: response.data.order.deviceUnit?.unlock_type,
    deviceType: response.data.order.device.deviceType.name,
    deviceTypeImage: response.data.order.device.deviceType.imageUrl,
    deviceCommercialName: response.data.order.device.commercial_name,
    deviceTechName: response.data.order.deviceUnit?.deviceVersion.version,
    deviceSerial: response.data.order.deviceUnit?.serial,
    customerFullName: response.data.order.customer.label,
    customerPhone: response.data.order.customer.phone,
    observation: response.data.order.observation,
    hasBudget: response.data.order.hasBudget,
    comments: comments,
    orderCheck: {
      damages: JSON.parse(response.data.order.orderCheck.damages),
      damagesDescription: response.data.order.orderCheck.damages_description,
      features: JSON.parse(response.data.order.orderCheck.features),
      featuresDescription: response.data.order.orderCheck.features_description,
    },
    total: response.data.order.budget.total,
    payments: response.data.order.payments,
  } as OrderExpanded;
};

export const getOrders = async () => {
  const response = await graphqlRequest(`
        query {
            orders {
                id
                status
                created_at
                observation

                customer {
                    label
                }
                comments {
                    id
                }

                device {
                    commercial_name
                    brand {
                        name
                        imageUrl
                    }
                    deviceType {
                        name
                        imageUrl
                    }
                }

                deviceUnit {
                    serial
                    deviceVersion {
                        version
                    }
                }
            }
        }
    `);

  handleGraphQLErrors(response.errors);

  const columns = response.data.orders.reduce(
    (acc: Map<TypedColumn, Column>, order: any) => {
      if (!acc.get(order.status)) {
        acc.set(order.status, {
          id: order.status,
          orders: [],
        });
      }

      acc.get(order.status)!.orders.push({
        $id: order.id,
        createdAt: order.created_at,
        createdAtDate: new Date(order.created_at),
        status: order.status,
        brand: order.device.brand.name,
        brandImage: order.device.brand.imageUrl,
        deviceType: order.device.deviceType.name,
        deviceTypeImage: order.device.deviceType.imageUrl,
        deviceCommercialName: order.device.commercial_name,
        deviceTechName: order.deviceUnit?.deviceVersion.version,
        deviceSerial: order.deviceUnit?.serial,
        customerFullName: order.customer.label,
        observation: order.observation,
        commentsQuantity: order.comments?.length,
      });

      return acc;
    },
    new Map<TypedColumn, Column>(),
  );

  // if column doesn have inprogress or done or order, create that column
  const columnTypes: TypedColumn[] = [
    TypedColumn.ForBudgeting,
    TypedColumn.Budgeting,
    TypedColumn.Budgeted,
    TypedColumn.ToDo,
    TypedColumn.Repairing,
    TypedColumn.Repaired,
  ];

  for (const columnType of columnTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        orders: [],
      });
    }
  }

  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0]),
    ),
  );

  const board: Board = {
    columns: sortedColumns,
  };

  return board;
};

export const getOrderCreationData = async (): Promise<QueryResponse> => {
  const response = await graphqlRequest(`
            query {
              customers {
                id
                label
                first_name
                last_name
                phone
                email
              }

              devices {
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

              brands {
                id
                label
              }

              deviceTypes {
                id
                label
              }

              deviceTypeChecks {
                device_type_id
                damages
                features
              }

              discounts {
                id
                label
                price
                type
              }
              services {
                id
                label
                price
              }
              morph {
                part
                discount
                serviceJob
              }
            }
        `);

  handleGraphQLErrors(response.errors);

  return response.data;
};

export const updateDiagnosis = async (
  id: string,
  diagnosis: string,
): Promise<boolean> => {
  const response = await graphqlRequest(`
    mutation {
      updateDiagnosis(
        id: "${id}",
        diagnosis: "${diagnosis}"
      )
    }
  `);

  handleGraphQLErrors(response.errors);

  return response.data.updateDiagnosis;
};

export const updateObservation = async (
  id: string,
  observation: string,
): Promise<boolean> => {
  const response = await graphqlRequest(`
    mutation {
      updateObservation(
        id: "${id}",
        observation: "${observation}"
      )
    }
  `);

  handleGraphQLErrors(response.errors);

  return response.data.updateObservation;
};

export const addPayment = async (
  order: string,
  amount: number,
): Promise<any> => {
  const response = await graphqlRequest(`
    mutation {
      addPayment(
        order: "${order}",
        amount: ${amount}
      ) {
        __typename
        ... on AddPaymentPayload {
          success
          amount
          created_at
        }
        ... on ErrorPayload {
          status
          i18nKey
        }
      }
    }
  `);

  handleGraphQLErrors(response.errors);

  return response.data.addPayment;
};
