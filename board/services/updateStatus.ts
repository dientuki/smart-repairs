import { TypedColumn } from "@/types/enums";

export const updateStatus = async (taskId: string, columnId: TypedColumn) => {
  const data = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
            mutation {
              updateOrderStatus(id: "${taskId}", status: "${columnId}")
          }
        `,
    }),
  });
};
