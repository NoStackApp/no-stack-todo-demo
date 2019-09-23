export default function flattenData(element) {
  const flatData ={
    ...element.instance,
    children: element.children,
  };
  if (element.children) flatData.children = element.children.map(child => flattenData(child));

  return flatData;
};
