import { IRoomEntity } from "../types/room.entity";
const defineBgColor = (room: IRoomEntity) => room.with_color ? `rgba(${parseInt(room.color.slice(1, 3), 16)}, ${parseInt(room.color.slice(3, 5), 16)}, ${parseInt(room.color.slice(5, 7), 16)}, 0.2)` : 'transparent';
export default defineBgColor;