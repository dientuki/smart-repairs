<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\OrderComment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class CommentMutation
{
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
        //$user = auth()->user();
        //$phone = $args['phone'];

        return OrderComment::updateVisibility($args['commentId'], $args['isPublic']);
    }

    public function updateText(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        // TODO implement the resolver
        //$user = auth()->user();
        //$phone = $args['phone'];

        return OrderComment::updateText($args['commentId'], $args['text']);
    }

    public function delete(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        // TODO implement the resolver
        //$user = auth()->user();
        //$phone = $args['phone'];

        return OrderComment::destroy($args['commentId']);
    }

    public function create(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        // TODO implement the resolver
        //$user = auth()->user();
        //$phone = $args['phone'];
        $team = DB::table('teams')->first()->id;
        $user = DB::table('users')->first()->id;
        //dd($args);

        return OrderComment::create([
            'id' => (string) Str::ulid(),
            'order_id' => $args['orderId'],
            'team_id' => $team,
            'comment' => strip_tags($args['comment']),
            'user_id' => $user,
            'is_public' => $args['isPublic'],
        ]);
    }

}