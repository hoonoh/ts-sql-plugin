export interface IDirective {
  directive: string;
  arg: any;
}

export const directiveRegex = new RegExp(
  /^\s*(--|\/\*)\s*ts-sql-plugin:(?<directive>[\w\d\-]+)(?:\((?<arg>.*)\))?\s*(\*\/)?\s*$/,
);

const takeUntil = <T>(source: T[], predicate: (val: T) => boolean) => {
  const takeUntil = source.findIndex(predicate);
  return source.slice(0, takeUntil);
};

export const parseDirectives = (query: string): IDirective[] => {
  return takeUntil(query.split("\n"), line => !line.match(/^\s*(?:(--|\/\*).*)?$/)).reduce((accum, line) => {
    const match = line.trimLeft().match(directiveRegex);
    if (match) {
      const { directive, arg } = match.groups!;
      return [...accum, { directive, arg: arg && JSON.parse(arg) }];
    } else {
      return accum;
    }
  }, [] as IDirective[]);
};
