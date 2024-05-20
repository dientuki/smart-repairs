type Props = {
  comment: Comment
}

function Comment({ comment }: Props) {

  return (
    <div>
        <div>
            {comment.user.name}
            {comment.created_at}
            {comment.is_public ? "Publico" : "Privado"}
        </div>
        <div>{comment.comment}</div>
    </div>
  )
};

export default Comment