import { type Knex } from 'knex';
import { type RangeNumberFilter } from '@knexion/filter';

export const getJoinQueryForDateOperator = (
  joinClause: Knex.JoinClause,
  column: string,
  operator: keyof RangeNumberFilter,
  value: number,
): Knex.JoinClause => {
  if (operator === 'gt') {
    joinClause.onVal(column, '>', value);
  } else if (operator === 'gte') {
    joinClause.onVal(column, '>=', value);
  } else if (operator === 'lt') {
    joinClause.onVal(column, '<', value);
  } else if (operator === 'lte') {
    joinClause.onVal(column, '<=', value);
  }

  return joinClause;
};
