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
    
    private LoadedSpriteSheets: { [filePath: string]: PIXI.LoaderResource } = {};
    
    async Load(filePath: string) {
        const loader = PIXI.Loader.shared;
        
        while (loader.loading) {
            await Sleep(10);
        }
        
        if (this.LoadedSpriteSheets[filePath]) {
            return this.LoadedSpriteSheets[filePath];
        }
        
        const resource = await new Promise<PIXI.LoaderResource>(resolve => {
            loader.add(filePath).load((_, resources) => {
                resolve(resources[filePath]);
            });
        });
        
        this.LoadedSpriteSheets[filePath] = resource;
        
        return resource;
    }
}