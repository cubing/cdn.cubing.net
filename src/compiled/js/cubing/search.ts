import { warn } from "../../../legacy-route-warning";

warn("cubing/search");

import { setSearchDebug } from "cubing/search";
setSearchDebug({ showWorkerInstantiationWarnings: false }); // We take responsibility for this on the CDN.

export * from "../../v0/js/cubing/search";