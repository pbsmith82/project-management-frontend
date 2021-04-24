class Type {

    static all = []

    constructor({id, name, description}) {
        this.id = id
        this.name = name
        this.description = description
        this.active = false
        Type.all.push(this)
    }

    addToDropDown(){
        const option = document.createElement('option')
        option.value  = this.id 
        option.innerText = this.name
        option.addEventListener('select', this.setActiveType)
        dropdown.append(option)
        dropdown.addEventListener('select', this.setActiveType)
        
    }

    addToDropDown2(){
        
        const dropdown2 = document.getElementById('types-selector')
        const option = document.createElement('option')
        option.value  = this.id 
        //debugger
        option.innerText = this.name
        if (dropdown2.attributes.value){
        if (option.value === dropdown2.attributes.value.value){
            option.selected = true
        }}
        //debugger
        dropdown2.append(option)
    }

}
