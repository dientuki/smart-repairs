export const updateCommentVisibility = async (commentId: string, isPublic: boolean) => {

  await fetch('http://localhost/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        query: `
            mutation {
              updateCommentVisibility(commentId: "${commentId}", isPublic: ${isPublic})
          }
        `
    })
  });
};

export const updateComment = async (commentId: string, text: string) => {

  await fetch('http://localhost/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        query: `
            mutation {
              updateComment(commentId: "${commentId}", text: "${text}")
          }
        `
    })
  });
}

export const deleteComment = async (commentId: string) => {

  await fetch('http://localhost/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        query: `
            mutation {
              deleteComment(commentId: "${commentId}")
          }
        `
    })
  });
}

export const addComment = async (newComment:NewOrderComment) => {

  const data = await fetch('http://localhost/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        query: `
            mutation {
              addComment(
                comment: "${newComment.comment}",
                orderId: "${newComment.orderId}",
                isPublic: ${newComment.isPublic}
              ) {
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
          }
        `
    })
  });

  const json = await data.json();

  return {
          id: json.data.addComment.id,
          comment: json.data.addComment.comment,
          createdAt: json.data.addComment.created_at,
          createdAtDate: new Date(json.data.addComment.created_at),
          isPublic: json.data.addComment.is_public,
          userId: json.data.addComment.user_id,
          userName: json.data.addComment.user.name,
          wasEdited: json.data.addComment.was_edited
      } as OrderComment;
}