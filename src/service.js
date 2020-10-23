export default function(repository) {
  if (repository === null || repository === undefined) {
    throw new Error("please provide repository");
  }
  return {
    // Define any method of the service here.
    // getByID(id) {
    //   return repository.getByID(id);
    // }
  };
}
