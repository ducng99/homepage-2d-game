import BlockTypes from './BlockTypes'
import Line from '../../utils/Line'

export default class LineBlock {
    private _line: Line;
    BlockTypes = BlockTypes.None;
    
    constructor(line: Line) {
        this._line = line;
    }
    
    get Line() { return this._line }
}