export function flattenChildData(element) {
  const flatData ={
    typeId: element.typeId,
  };

  if (element.instances) {
    flatData.instances = element.instances.map(
      instance => flattenData(instance)
    );
  }

  return flatData;
};

export function flattenData(element) {
 const flatData = {
   ...element.instance,
 };

  if (element.children) {
    flatData.children = element.children.map(
      child => flattenChildData(child)
    );
  }

  return flatData;
};
