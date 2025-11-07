class Type {

    static all = []

    constructor({id, name, description}) {
        this.id = id
        this.name = name
        this.description = description
        Type.all.push(this)
    }

    addType(container, selectorId, selectedValue){
        const option = document.createElement('option')
        option.value  = this.id 
        option.innerText = this.name
        
        if(container && selectorId){
            const dropdown = container.querySelector(`#${selectorId}`) || document.getElementById(selectorId)
            if (dropdown) {
                if (selectedValue && parseInt(selectedValue) === this.id) {
                    option.selected = true
                }
                dropdown.append(option)
            }
        } else {
            // Fallback to original behavior for filter dropdown
            const dropdown = document.getElementById('type_filter')
            if (dropdown) {
                dropdown.append(option)
            }
        }
    }

}
