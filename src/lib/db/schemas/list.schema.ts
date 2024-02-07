import {
  type Static,
  type TArray,
  type TBoolean,
  type TObject,
  type TSchema,
  Type,
} from '@sinclair/typebox';
import { timestampSchema } from '@lib/schemas/field.schema';
import { ref } from '@lib/schemas';

export const dataOptionsDtoSchema = Type.Object(
  {
    expand: Type.Optional(
      Type.Array(Type.String(), {
        description:
          'Expand related data: `team` for retrieve, `data.team` for list',
      }),
    ),
    include: Type.Optional(
      Type.Array(Type.String(), {
        description: 'Include additional values in response',
      }),
    ),
  },
  { $id: 'DataOptions' },
);
export type DataOptionsDto = Static<typeof dataOptionsDtoSchema>;

export const dateFilterDtoSchema = Type.Object(
  {
    gt: Type.Optional(Type.Number()),
    gte: Type.Optional(Type.Number()),
    lt: Type.Optional(Type.Number()),
    lte: Type.Optional(Type.Number()),
  },
  { $id: 'DateFilter' },
);

export const listOptionsDtoSchema = Type.Intersect(
  [
    Type.Object(
      {
        page_after: Type.Optional(
          Type.String({
            description:
              'A cursor for use in pagination. starting_after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include starting_after=obj_foo in order to fetch the next page of the list',
          }),
        ),
        page_before: Type.Optional(
          Type.String({
            description:
              'A cursor for use in pagination. ending_before is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_bar, your subsequent call can include ending_before=obj_bar in order to fetch the previous page of the list',
          }),
        ),
        limit: Type.Optional(
          Type.Number({
            description:
              'A limit on the number of objects to be returned. Limit can range between 1 and 100 items.',
            minimum: 1,
            maximum: 100,
          }),
        ),
        sort: Type.Optional(
          Type.Array(Type.String(), {
            description: 'A array of fields to sort order',
          }),
        ),
        created_at: Type.Optional(
          Type.Union([timestampSchema, ref(dateFilterDtoSchema)]),
        ),
      },
      { additionalProperties: false },
    ),
    dataOptionsDtoSchema,
  ],
  {
    $id: 'ListOptions',
  },
);
export type ListOptionsDto = Static<typeof listOptionsDtoSchema>;

export const listSchema = <T extends TSchema>(
  schema: T,
): TObject<{
  data: TArray<T>;
  has_more_next: TBoolean;
  has_more_previous: TBoolean;
}> =>
  Type.Object(
    {
      data: Type.Array(schema),
      has_more_next: Type.Boolean(),
      has_more_previous: Type.Boolean(),
    },
    { additionalProperties: false },
  );

export interface List<T> {
  data: T[];
  has_more_next: boolean;
  has_more_previous: boolean;
}
