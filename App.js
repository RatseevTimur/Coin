// @ts-nocheck
import { Canvas, useFrame, useLoader } from '@react-three/fiber/native';
import { useState, useEffect, useRef, Suspense, useLayoutEffect } from 'react';
import {StyleSheet,View, Text} from 'react-native';
import { TextureLoader } from 'expo-three';
import { useAnimatedSensor, SensorType } from 'react-native-reanimated';
import { Accelerometer } from 'expo-sensors';

function Accelemeter() {
  const [data, setData] = useState({});

  useEffect(() => {
    _subscribe();
  }, []);

  const _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
    });
  };

  let { x, y, z } = data;

  return (
    <View>
      <Text>Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>
      <Text>
        x: {Math.round(x)} y: {Math.round(y)} z: {Math.round(z)}
      </Text>
    </View>
  );
};


function Coin(props) {
  const [active, setActive] = useState(false);

  const mesh = useRef();
  const textureLoader = new TextureLoader();
  const dummyURL = require('./assets/r.jpg')
  const dummyTexture = textureLoader.load(dummyURL);

  const dummyURL2 = require('./assets/o.jpg')
  const dummyTexture2 = textureLoader.load(dummyURL2);

  const dummyURLE = require('./assets/e.jpg')
  const dummyTextureE = textureLoader.load(dummyURLE);

  const rotationCoin = Math.floor(Math.random() * 2) === 0 ? 36.1284 : 32.9868

  useFrame((state, delta) => {
    if (active && mesh.current.rotation.y < rotationCoin) {
      mesh.current.rotation.y += delta*8;
      mesh.current.rotation.x += delta*8;
    }
  });

  function rotationGo(){
    setActive(!active)
    if (mesh.current.rotation.x >= rotationCoin) {
      mesh.current.rotation.y = 1.5708
      mesh.current.rotation.x = 1.5708
      setActive(!active)
    }
  }

  return (
    <mesh
      {...props}
      ref={mesh}
      rotation-x={1.5708}
      rotation-y={1.5708}
      scale={active ? 1.5 : 1}
      onClick={(event) => rotationGo()}
    >
      <cylinderBufferGeometry attach="geometry" args={[1, 1, 0.1]} />
      <meshStandardMaterial attach="material-0" map={dummyTextureE} />
      <meshStandardMaterial attach="material-1" map={dummyTexture2} />
      <meshStandardMaterial attach="material-2" map={dummyTexture} />
    </mesh>
  );
}

export default function App() {
  const animatedSensor = useAnimatedSensor(SensorType.GYROSCOPE, {
    interval: 100,
  });

  return (
    <View style={{
      height: '100%'
    }}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <Coin />
      </Canvas>

      <Accelemeter />
    </View>
  );
}
