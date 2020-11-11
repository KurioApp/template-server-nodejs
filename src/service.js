export default function(repository) {
  if (!repository) {
    throw new Error("please provide repository");
  }
  return {
    // Define any method of the service here.
    // getByID(id) {
    //   return repository.getByID(id);
    // }
  };
}
