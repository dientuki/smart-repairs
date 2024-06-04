<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderComment extends ModelWithTeam
{
    use HasFactory;

    protected $fillable = ['order_id', 'comment', 'team_id', 'user_id'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public static function updateVisibility(string $commentId, bool $status): bool {
        $comment = OrderComment::find($commentId);
        $comment->is_public = $status;
        return $comment->save();
    }

    public static function updateText(string $commentId, string $text): bool {
        $comment = OrderComment::find($commentId);
        $comment->comment = $text;
        $comment->was_edited = true;
        return $comment->save();
    }
}
