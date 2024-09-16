<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\OrderComment;
use App\Traits\UserDataTrait;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class CommentMutation
{
    use UserDataTrait;

    private function isMyComment(string $commentId): bool
    {
        $user = $this->getUserId();
        $comment = OrderComment::find($commentId);

        return $user && $user->id === $comment->user_id;
    }

    /**
     * Return a value for the field.
     *
     * @param  null  $root Always null, since this field has no parent.
     * @param  array{}  $args The field arguments passed by the client.
     * @param  \Nuwave\Lighthouse\Support\Contracts\GraphQLContext  $context Shared between all fields.
     * @param  \GraphQL\Type\Definition\ResolveInfo  $resolveInfo Metadata for advanced query resolution.
     * @return mixed The result of resolving the field, matching what was promised in the schema
     */
    public function updateVisibility(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        // TODO implement the resolver

        if ($this->isMyComment($args['commentId'])) {
            return OrderComment::updateVisibility($args['commentId'], $args['isPublic']);
        }

        return null;
    }

    public function updateText(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        // TODO implement the resolver
        if ($this->isMyComment($args['commentId'])) {
            return OrderComment::updateText($args['commentId'], $args['text']);
        }

        return null;
    }

    public function delete(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        // TODO implement the resolver
        if ($this->isMyComment($args['commentId'])) {
            return OrderComment::destroy($args['commentId']);
        }

        return null;
    }

    public function create(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        $team_id = $this->getTeamId();

        return OrderComment::create([
            'order_id' => $args['orderId'],
            'team_id' => $team_id,
            'comment' => strip_tags($args['comment']['comment']),
            'user_id' => $this->getUserId(),
            'is_public' => $args['comment']['isPublic'],
        ]);
    }
}
