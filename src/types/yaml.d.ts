// required for importing yaml files

declare module "*.yaml" {
  const value: any;
  export default value;
}
