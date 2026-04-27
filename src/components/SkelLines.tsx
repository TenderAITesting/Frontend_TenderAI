import { NJSkeletonContainer, NJSkeletonRectangle } from '@engie-group/fluid-design-system-react';

export default function SkelLines({ n }) {
  return (
    <NJSkeletonContainer>
      {Array.from({ length: n }, (_, i) => (
        <NJSkeletonRectangle
          key={i}
          style={{ width: i === n - 1 ? '60%' : '100%', marginBottom: 6 }}
        />
      ))}
    </NJSkeletonContainer>
  );
}
