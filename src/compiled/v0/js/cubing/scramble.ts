import { setSearchDebug } from "cubing/search";

setSearchDebug({ showWorkerInstantiationWarnings: false }); // We take responsibility for this on the CDN.

export * from "cubing/scramble";
