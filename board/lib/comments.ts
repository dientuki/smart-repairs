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