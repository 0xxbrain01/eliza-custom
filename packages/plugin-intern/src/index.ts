import { Plugin } from "@elizaos/core";
import { executeGetPrice } from "./actions/get-price";


export const InternPlugin: Plugin = {
  name: "internPlugin",
    description: "intern Plugin custom on Eliza",
    actions: [
        executeGetPrice,
    ],
    evaluators: [],
    providers: [],


}
export default InternPlugin;