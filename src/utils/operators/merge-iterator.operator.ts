import { type ObservableInput, type OperatorFunction, pipe } from 'rxjs';
import { mergeAll, mergeMap } from 'rxjs/operators';
import { type ICommand, type IEvent } from '@modules/cqrs';

export const mergeIterator = <T extends IEvent>(
  project: (value: T, index: number) => ObservableInput<ICommand>[],
): OperatorFunction<T, ICommand> => {
  return pipe(mergeMap(project), mergeAll());
};
