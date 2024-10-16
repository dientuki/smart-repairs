import {
  graphqlRequest,
  handleGraphQLErrors,
  escapeGraphQLString,
} from "@/helper/graphqlHelpers";

export const updateComment = async (
  id: string,
  data: CreateOrUpdateComment,
): Promise<boolean> => {
  const response = await graphqlRequest(`
    mutation {
      updateComment(
        commentId: "${id}",
        comment: {
          comment: "${escapeGraphQLString(data.comment)}",
          ispublic: ${data.ispublic}
        }
      )
    }
  `);

  handleGraphQLErrors(response.errors);

  return response.data.updateComment;
};

export const deleteComment = async (id: string): Promise<boolean> => {
  const response = await graphqlRequest(`
    mutation {
      deleteComment(commentId: "${id}")
    }
  `);

  handleGraphQLErrors(response.errors);

  return response.data.deleteComment;
};

export const addComment = async (
  orderId: string,
  data: CreateOrUpdateComment,
): Promise<OrderComment> => {
  const response = await graphqlRequest(`
            mutation {
              addComment(
                orderId: "${orderId}",
                comment: {
                  comment: "${escapeGraphQLString(data.comment)}",
                  ispublic: ${data.ispublic}
                }
              ) {
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
          }
        `);

  handleGraphQLErrors(response.errors);

  return {
    id: response.data.addComment.id,
    comment: response.data.addComment.comment,
    createdAt: response.data.addComment.created_at,
    createdAtDate: new Date(response.data.addComment.created_at),
    isPublic: response.data.addComment.is_public,
    userId: response.data.addComment.user_id,
    userName: response.data.addComment.user.name,
    userImage: response.data.addComment.user.imageUrl,
    wasEdited: response.data.addComment.was_edited,
  };
};
