import { graphqlRequest, arrayToString, handleGraphQLErrors } from "@/helper/functions";

export const createOrder = async (newOrder: NewOrder) => {

    const response = await graphqlRequest(`
                        mutation {
                            addOrder(order: {
                                customer_id: "${newOrder.customerId}"
                                device_unit_id: "${newOrder.deviceUnitId}"
                                observation: "${newOrder.observation}"
                                damages: ${arrayToString(newOrder.damages)}
                                damage_description: "${newOrder.damageDescription}"
                                features: ${arrayToString(newOrder.features)}
                                feature_description: "${newOrder.featureDescription}"
                            })
                    }
                `);

    handleGraphQLErrors(response.errors);

    return response.data.addOrder;

}