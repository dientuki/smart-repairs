import Comment from "./Comment"

type Props = {
    comments: Comment[]
  }
function Comments({ comments }: Props) {
  return (
    <div>
        <div>Comentarios</div>
        {comments && comments.map((comment, index) => (
            <Comment key={index} comment={comment} />
        ))}
    </div>
  )
}

export default Comments