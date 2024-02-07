import { expect, use as chaiUse } from 'chai';
import { default as chaiExclude } from 'chai-exclude';
import { default as chaiAsPromised } from 'chai-as-promised';
import { default as sinonChai } from 'sinon-chai';
import { default as chaiSubset } from 'chai-subset';

chaiUse(chaiSubset);
chaiUse(chaiAsPromised);
chaiUse(chaiExclude);
chaiUse(sinonChai);

export { expect };
