import { Instance, Instances } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, MathUtils, Vector3 } from "three";
import { randInt } from "three/src/math/MathUtils";

const greenColor = new Color("green");
greenColor.multiplyScalar(12);

const redColor = new Color("red");
redColor.multiplyScalar(12);

const whiteColor = new Color("white");
whiteColor.multiplyScalar(12);

const blueColor = new Color("blue");
blueColor.multiplyScalar(12);

const yellowColor = new Color("yellow");
yellowColor.multiplyScalar(12);

const colors = [greenColor, redColor, whiteColor, blueColor, yellowColor];

const AnimatedBox = ({ scale, target, speed, color }) => {
  const ref = useRef();
  const creationTime = useRef(Date.now());
  useFrame((_, delta) => {
    if (ref.current.scale.x > 0) {
      ref.current.scale.x =
        ref.current.scale.y =
        ref.current.scale.z -=
          speed * delta;
    }
    ref.current.position.lerp(target, speed);
  });
  return (
    <Instance ref={ref} scale={scale} position={[0, 0, 0]} color={color} />
  );
};

export const Explosion = ({
  nb = 100,
  position = new Vector3(0, 0, 0),
  limitX = 5,
  limitY = 10,
  limitZ = 10,
  scale = 0.4,
  multicolor = true,
}) => {
  const boxes = useMemo(
    () =>
      Array.from({ length: nb }, () => ({
        target: new Vector3(
          MathUtils.randFloat(-limitX, limitX),
          MathUtils.randFloat(0, limitY),
          MathUtils.randFloat(-limitZ, limitZ)
        ),
        scale, //MathUtils.randFloat(0.03, 0.09),
        speed: MathUtils.randFloat(0.4, 0.6),
      })),
    [nb]
  );
  return (
    <group position={[position.x, position.y, position.z]}>
      <Instances>
        <boxGeometry />
        <meshStandardMaterial toneMapped={false} />
        {boxes.map((box, i) => (
          <AnimatedBox
            key={i}
            color={
              multicolor ? colors[randInt(0, colors.length - 1)] : redColor
            }
            {...box}
          />
        ))}
      </Instances>
    </group>
  );
};
