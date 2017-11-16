import React from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  Text,
  View,
  Plane
} from 'react-vr';

export default class ReactVrTest extends React.Component {

  render() {
    return (
      <View>
        <Pano source={asset('chess-world.jpg')}/>


        <Plane dimWidth={2} dimHeight={1}
          uniforms={{'texMask': {'value': asset('chess-world-dummy-mask.jpg')}}}
          texture={asset('chess-world-dummy-mask.jpg')}
          materialParameters={{
             fragmentShader: '\
             uniform sampler2D   tex0;\
             uniform sampler2D   texMask;\
             varying vec2  vUv;\
\
             void main()	{\
               vec4 color = texture2D(tex0, vUv);\
               vec4 maskClr = texture2D( texMask, vUv);\
               gl_FragColor = vec4(0.5,0,0,1.0)+color;\
             }\
             ',
             vertexShader: '    varying vec2 vUv;\
                 void main()	{\
                   vUv = uv;\
                   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
                 }',
             transparent: true,
          }}
          style={{
            transform: [{translate: [0, 0, -2]}]}}/>

        {/* <Text
          style={{
            backgroundColor: '#777879',
            fontSize: 0.8,
            fontWeight: '400',
            layoutOrigin: [0.5, 0.5],
            paddingLeft: 0.2,
            paddingRight: 0.2,
            textAlign: 'center',
            textAlignVertical: 'center',
            transform: [{translate: [0, 0, -3]}],
          }}>
          hello
        </Text> */}
      </View>);
  }
};

AppRegistry.registerComponent('ReactVrTest', () => ReactVrTest);
