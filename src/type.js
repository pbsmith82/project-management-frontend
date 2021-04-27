class Type {

    static all = []

    constructor({id, name, description}) {
        this.id = id
        this.name = name
        this.description = description
        Type.all.push(this)
    }

    addType(event){
        const option = document.createElement('option')
        option.value  = this.id 
        option.innerText = this.name
        if(event){
            const dropdown2 = document.getElementById('types-selector')
            if (dropdown2.attributes.value){
                if (option.value === dropdown2.attributes.value.value){
                    option.selected = true
                }}
                dropdown2.append(option)
        }else {
            dropdown.append(option)
        }
        
    }

}
