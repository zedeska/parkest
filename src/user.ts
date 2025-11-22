class User{

    typeVehicule: string;
    pmr: boolean;
    dspOnly: boolean;
    
    constructor(typeVehicule: string, pmr: boolean, dspOnly: boolean){
        this.typeVehicule = typeVehicule;
        this.pmr = pmr;
        this.dspOnly = dspOnly;
    }
}

export default User;