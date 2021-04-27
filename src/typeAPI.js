class TypeApi {

    static baseURL = 'http://localhost:3000/project_types'
        

    static getTypes(event){
        fetch(this.baseURL)
        .then(r => r.json())
        .then( json => {
                json["data"].forEach(type => {
                    const t = new Type({id: type.id, ...type.attributes})
                        t.addType(event) 
                })
        })
    }

}