

export { devPupulator as DevPupulator }


 function devPupulator(service:any) {

    for(let i=0;i<20;i++){
        let patient = {name:"name"+i,surname:"surname"+i,dni:"dni"+i,email:"email"+i,address:"address"+i,phone:"phone"+i}

        service.postDBinvoices(patient)
    }

    for(let i=0;i<10;i++){
        let patient = {name:"name"+i,dni:"dni"+i,email:"email"+i,address:"address"+i,phone:"phone"+i,isorg:true}

        service.postDBinvoices(patient)
    }


  }