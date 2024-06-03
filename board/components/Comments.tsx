import Comment from "./Comment";

type Props = {
    comments: OrderComment[]
  }
function Comments({ comments }: Props) {
  return (
    <div>
        <h3 className="mb-2 text-xl font-medium">Comentarios ({comments.length})</h3>
        <div className="flex flex-col gap-5">
          {comments && comments.map((comment, index) => (
              <Comment key={index} comment={comment} />
          ))}
        </div>
    </div>
  )
}

export default Comments