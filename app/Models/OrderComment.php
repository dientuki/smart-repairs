<?php

namespace App\Models;

use App\Traits\HasTeamTrait;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderComment extends ModelAuditable
{
    use HasTeamTrait;

    protected $fillable = ['order_id', 'comment', 'team_id', 'user_id', 'is_public', 'was_edited'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function updateVisibility(string $commentId, bool $status): bool
    {
        $comment = OrderComment::find($commentId);
        $comment->is_public = $status;
        return $comment->save();
    }

    public static function updateText(string $commentId, string $text): bool
    {
        $comment = OrderComment::find($commentId);
        $comment->comment = $text;
        $comment->was_edited = true;
        return $comment->save();
    }
}
