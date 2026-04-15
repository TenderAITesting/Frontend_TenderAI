import { NJSkeletonRectangle } from '@engie-group/fluid-design-system-react';

export default function SkelLines({ n }) {
  return Array.from({ length: n }, (_, i) => (
    <NJSkeletonRectangle
      key={i}
      style={{ width: i === n - 1 ? '60%' : '100%', height: 9, marginBottom: 6 }}
    />
  ));
}
