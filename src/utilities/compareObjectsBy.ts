const compareObjectsBy = (field: string) => (a: any, b: any) => {
  if (a[field] < b[field]) {
    return -1
  }
  if (a[field] > b[field]) {
    return 1
  }
  return 0
}

export default compareObjectsBy
