import Image from "next/image";
import styles from "./page.module.css";
import EEGMusicInterface from './EEGMusicInterface';
import BrainAnim from "./brain-anim/BrainAnim"

export default function Home() {
  return (
    <div style={{backgroundColor: 'black'}}>
      <BrainAnim></BrainAnim>
      <EEGMusicInterface></EEGMusicInterface>
    </div>
  );
}
