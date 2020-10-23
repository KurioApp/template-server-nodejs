// this function will be exported and can be injected with any dependencies
export default function(database) {
  if (database === null || database === undefined) {
    throw new Error("please provide database");
  }
  return {
    // Define any method of the repository layer.
    // getByID(id) {
    //   return database.get(id);
    // }
  };
}
