import __dirname from '../../util.js';
import fileSystem from 'fs';

export default class StudentService {
    #students;
    #dirPath;
    #filePath;
    #fileSystem;


    constructor(){
        this.#students = new Array();
        this.#dirPath = __dirname+'/files';
        this.#filePath = this.#dirPath+"/students.json";
        this.#fileSystem = fileSystem;
    }

    #prepararDirectorioBase = async () =>{ await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });
        if(!this.#fileSystem.existsSync(this.#filePath)) {
            
            await this.#fileSystem.promises.writeFile(this.#filePath, "[]");
        }
    }

    save = async (student) => {
        console.log("Guardar recurso:");
        console.log(student);
        student.id = Math.floor(Math.random()*20000+1);
        try {
            await this.#prepararDirectorioBase();
            this.#students = await this.getAll();
            this.#students.push(student);
            await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify(this.#students));
            return student;
            
        } catch (error) {
            console.error(`Error guardando recurso: ${JSON.stringify(usuarioNuevo)}, detalle del error: ${error}`);
            throw Error(`Error guardando recurso: ${JSON.stringify(usuarioNuevo)}, detalle del error: ${error}`);
        }
    }

    getAll = async () =>{
        try {
            await this.#prepararDirectorioBase();
       
            let data = await this.#fileSystem.promises.readFile(this.#filePath, "utf-8");
      
            console.log(data);
            this.#students = JSON.parse(data);
            console.log("Usuarios encontrados: ");
            console.log(this.#students);
            return this.#students;
        } catch (error) {
            console.error(`Error consultando los usuarios por archivo, valide el archivo: ${this.#dirPath}, 
                detalle del error: ${error}`);
            throw Error(`Error consultando los usuarios por archivo, valide el archivo: ${this.#dirPath},
             detalle del error: ${error}`);
        }
    }
};