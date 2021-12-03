import * as PIXI from 'pixi.js';
import { Sleep } from '.';

export default class SpriteSheetManager {
    private static _instance: SpriteSheetManager;
    static get Instance() {
        if (!this._instance) {
            this._instance = new SpriteSheetManager();
        }
        
        return this._instance;
    }
    
    private readonly Loader = new PIXI.Loader();
    
    private LoadedSpriteSheets: { [filePath: string]: PIXI.LoaderResource } = {};
    
    async Load(filePath: string) {        
        while (this.Loader.loading) {
            await Sleep(10);
        }
        
        if (this.LoadedSpriteSheets[filePath]) {
            return this.LoadedSpriteSheets[filePath];
        }
        
        const resource = await new Promise<PIXI.LoaderResource>(resolve => {
            this.Loader.add(filePath).load((_, resources) => {
                resolve(resources[filePath]);
            });
        });
        
        this.LoadedSpriteSheets[filePath] = resource;
        
        return resource;
    }
}