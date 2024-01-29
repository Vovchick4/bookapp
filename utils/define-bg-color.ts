import { IRoomEntity } from "../types/room.entity";
const defineBgColor = (room: IRoomEntity, op = 0.2) => room.with_color ? `rgba(${parseInt(room.color.slice(1, 3), 16)}, ${parseInt(room.color.slice(3, 5), 16)}, ${parseInt(room.color.slice(5, 7), 16)}, ${op})` : 'transparent';
export default defineBgColor;