import { graphqlRequest, arrayToString, handleGraphQLErrors } from "@/helper/functions";
import { extra } from "@/helper/reduce";

export const createOrder = async (newOrder: NewOrder) => {

    const response = await graphqlRequest(`
                        mutation {
                            addOrder(order: {
                                customerid: "${newOrder.customerId}"
                                observation: "${newOrder.observation}"
                                damages: ${arrayToString(newOrder.damages)}
                                damagedescription: "${newOrder.damageDescription}"
                                features: ${arrayToString(newOrder.features)}
                                featuredescription: "${newOrder.featureDescription}"
                                tempdeviceunitid: "${newOrder.tempDeviceUnitId}"
                                deviceid: "${newOrder.deviceid}"
                            })
                    }
                `);

    handleGraphQLErrors(response.errors);

    return response.data.addOrder;

}

export const getOrder = async (id: string) => {

    const response = await graphqlRequest(`
        query {
            order(id: "${id}") {
                id
                status
                created_at
                observation

                author {
                    name
                }

                customer {
                    first_name
                    last_name
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
                    serial
                    unlock_type
                    unlock_code
                    deviceVersion {
                        version
                    }
                }
            }
        }
    `);

    handleGraphQLErrors(response.errors);

    const comments: OrderComment[] = response.data.order.comments.reduce((acc: OrderComment[], comment: any) => {
        acc.push({
            id: comment.id,
            comment: comment.comment,
            createdAt: comment.created_at,
            createdAtDate: new Date(comment.created_at),
            isPublic: comment.is_public,
            userId: comment.user_id,
            userName: comment.user.name,
            wasEdited: comment.was_edited
        });

        return acc;

    }, []);

    return {
        $id: response.data.order.id,
        createdAt: response.data.order.created_at,
        createdAtDate: new Date(response.data.order.created_at),
        author: response.data.order.author.name,
        status: response.data.order.status,
        brand: response.data.order.device.brand.name,
        brandImage: response.data.order.device.brand.imageUrl,
        deviceType: response.data.order.device.deviceType.name,
        deviceTypeImage: response.data.order.device.deviceType.imageUrl,
        deviceCommercialName: response.data.order.device.commercial_name,
        deviceTechName: response.data.order.deviceUnit?.deviceVersion.version,
        deviceSerial: response.data.order.deviceUnit?.serial,
        customerFullName: `${response.data.order.customer.first_name} ${response.data.order.customer.last_name}`,
        customerPhone: response.data.order.customer.phone,
        observation: response.data.order.observation,
        comments: comments
    } as Order;

}

export const getOrders = async () => {
    const response = await graphqlRequest(`
        query {
            orders {
                id
                status
                created_at
                observation

                customer {
                    first_name
                    last_name
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

    const columns = response.data.orders.reduce((acc: Map<TypedColumn, Column>, order: any ) => {

        if (!acc.get(order.status)) {
            acc.set(order.status, {
                id: order.status,
                orders: []
            })
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
            customerFullName: `${order.customer.first_name} ${order.customer.last_name}`,
            observation: order.observation,
            commentsQuantity: order.comments?.length
        })

        return acc;

    }, new Map<TypedColumn, Column>());

    // if column doesn have inprogress or done or order, create that column
    const columnTypes: TypedColumn[] = ["for budgeting", "budgeting", "budgeted", "to do", "repairing", "repaired"];
    for (const columnType of columnTypes) {
        if (!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                orders: []
            })
        }
    }

    const sortedColumns = new Map(
        Array.from(columns.entries()).sort(
            (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        )
    )

    const board: Board = {
        columns: sortedColumns
    }

    return board;
}

export const getOrderCreationData = async () => {
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

            }
        `);

    handleGraphQLErrors(response.errors);

    const devices: OptionType[] = response.data.devices.reduce((acc: OptionType[], device: any): OptionType[] => {
        acc.push({
            id: device.id,
            label: `${device.brand.name} ${device.commercial_name}`,
            info: {
                commercialname: device.commercial_name,
                brandid: device.brand.id,
                brand: device.brand.name,
                typeid: device.deviceType.id,
                type: device.deviceType.name,
                url: device.url
            }
        });

        return acc;

    }, []);

        /*
    const devicesChecks: DeviceChecks[] = response.data.deviceTypeChecks.reduce((acc: DeviceChecks[], device: any) => {
        acc.push({
            deviceTypeId: device.device_type_id,
            damages: device.damages,
            features: device.features,
        });

        return acc;

      }, []);

    const devicesRepared: DeviceRepared[] = response.data.devicesRepared.reduce((acc: DeviceRepared[], device: any) => {
        acc.push({
            id: device.id,
            label: `${device.deviceVersion.device.brand.name} ${device.deviceVersion.device.commercial_name} - ${device.serial}`,
            deviceId: device.deviceVersion.device.id,
            serial: device.serial,

        });

        return acc;

    }, []);
        */

    return {
        customers: extra(response.data.customers),
        brands: response.data.brands,
        deviceTypes: response.data.deviceTypes,
        devices: devices,
        /*
        devicesChecks: devicesChecks
        */
    }
}
