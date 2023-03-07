/*
    Source:
    https://stackoverflow.com/questions/52882658/regex-for-brazilian-phone-number
    https://pt.functions-online.com/preg_split.html
*/
import substr_replace from './substr.replace';

 function mask_phone_number(phoneNumber:string, countryCode?:string):{message:string, result:boolean, phoneNumber:string} {
    if(!phoneNumber) return {message:"There is no PhoneNumber.", result: false, phoneNumber}
    
    let newNumber:string; // Formmated Number
    let prefix= countryCode || '55';

    //remove tudos os caracteres especias, deixando apenas numeros
    phoneNumber = phoneNumber.replace(/[^0-9\.]+/gm, ''); 

    if(phoneNumber.length <= 7) {
        return {message:"PhoneNumber Invalid", result: false, phoneNumber}
    }

    //Verifica se o numero tem +55. Se SIM passa!
    const pos = phoneNumber.indexOf(prefix);

    if (pos == 0){
        phoneNumber = substr_replace(phoneNumber, '', pos, prefix.length);
    }
    
    //Split the phonenumber in a array [0]-> null   [1]-> DDD  [2]->99685 [3]->9001 [4]->null
    let phoneNumberArray = phoneNumber.split(/^\s*(\d{2}|\d{0})[-. ]?(\d{5}|\d{4})[-. ]?(\d{4})[-. ]?\s*$/);
    // console.log("returnValue:", returnValue);

    //Check If there is a city with restrictions on number 9 --> 11 ao 28 DDD de SP, RJ e ES
    const DDD =parseInt(phoneNumber.substring(0,2),10);        

    //Validator DDD not to confident that will be DDD, could be the format of the number as well
    if(phoneNumberArray[1].length === 1 || phoneNumberArray[1].length === 0 || phoneNumberArray[1].length === null){
        return {message:"PhoneNumber DDD/Format Invalid", result: false, phoneNumber}
    }

     if ( DDD >= 11 && DDD <= 28){
        newNumber = prefix + phoneNumberArray[1] + phoneNumberArray[2] + phoneNumberArray[3];
     } else {
         if(phoneNumberArray[2].length === 5){
             let nineRemoved = phoneNumberArray[2].substring(1);// 99685 --> 9685 
             newNumber = prefix + phoneNumberArray[1] + nineRemoved + phoneNumberArray[3];
         }else{
             newNumber = prefix + phoneNumberArray[1] + phoneNumberArray[2] + phoneNumberArray[3];
         }
     }
     /**
         * No Brasil, este formato tem o número máximo de 14 (quatorze) dígitos. 
         * Por exemplo, se um de seus contatos está no Brasil (código do país: 1) e 
         * tem o código de área de São Paulo (DDD) 11, e o número de telefone celular 
         * dele é 9XXXX-YYYY, você deve inserir +55119XXXXYYYY (sem espaços entre os dígitos).
         * @Source https://ajuda.na5.com.br/pt-br/formato-numero-telefone-internacional-e164#:~:text=No%20Brasil%2C%20este%20formato%20tem,sem%20espa%C3%A7os%20entre%20os%20d%C3%ADgitos).
         */
        if(!((newNumber.length > 10) && (newNumber.length <= 14))){
            return {message:"PhoneNumber Format Invalid", result: false, phoneNumber}
        }
        return {message:"PhoneNumber Formatted", result: true, phoneNumber: newNumber}
}
export default mask_phone_number;

/**
 * Old JS Version
 */
// const mask_phone_number_2 = async (phonenumber, countryCode=null)=>{
//     return new Promise((resolve, reject)=> {
//         if(!phonenumber) return reject({message:"There is no PhoneNumber.", result: null})
        
//         let _phonenumber = String(phonenumber);
//         let newNumber;//Formmated Number
//         let prefix= countryCode || '55';

//         //remove tudos os caracteres especias, deixando apenas numeros
//         _phonenumber = _phonenumber.replace(/[^0-9\.]+/gm, ''); 

//         if(_phonenumber.length <= 7) {
//             return reject({message:"PhoneNumber Invalid", result: null, phoneNumber:_phonenumber})
//         }

//         //Verifica se o numero tem +55. Se SIM passa!
//         const pos = _phonenumber.indexOf(prefix);

//         if (pos == 0){
//             _phonenumber = substr_replace(_phonenumber, '', pos, prefix.length);
//         }
        
//         //Split the phonenumber in a array [0]-> null   [1]-> DDD  [2]->99685 [3]->9001 [4]->null
//         let returnValue = _phonenumber.split(/^\s*(\d{2}|\d{0})[-. ]?(\d{5}|\d{4})[-. ]?(\d{4})[-. ]?\s*$/);
//         // console.log("returnValue:", returnValue);

//         //Check If there is a city with restrictions on number 9 --> 11 ao 28 DDD de SP, RJ e ES
//         const DDD =parseInt(_phonenumber.substring(0,2),10);        

//         //Validator DDD not to confident that will be DDD, could be the format of the number as well
//         if(returnValue[1].length === 1 || returnValue[1].length === 0 || returnValue[1].length === null){
//             return reject({message:"PhoneNumber DDD/Format Invalid", result: null, phoneNumber:_phonenumber})
//         }

//          if ( DDD >= 11 && DDD <= 28){
//             newNumber = prefix + returnValue[1] + returnValue[2] + returnValue[3];
//          }else{
//              if(returnValue[2].length == 5){
//                  let removed = returnValue[2].substring(1);// 99685 --> 9685
//                  newNumber = prefix + returnValue[1] + removed + returnValue[3];
//              }else{
//                  newNumber = prefix + returnValue[1] + returnValue[2] + returnValue[3];
//              }
//          }
//          /**
//          * No Brasil, este formato tem o número máximo de 14 (quatorze) dígitos. 
//          * Por exemplo, se um de seus contatos está no Brasil (código do país: 1) e 
//          * tem o código de área de São Paulo (DDD) 11, e o número de telefone celular 
//          * dele é 9XXXX-YYYY, você deve inserir +55119XXXXYYYY (sem espaços entre os dígitos).
//          * @Source https://ajuda.na5.com.br/pt-br/formato-numero-telefone-internacional-e164#:~:text=No%20Brasil%2C%20este%20formato%20tem,sem%20espa%C3%A7os%20entre%20os%20d%C3%ADgitos).
//          */
//         if( !((newNumber.length > 10) && (newNumber.length <= 14)) ) {
//             return reject({message:"PhoneNumber Format Invalid", result: null, phoneNumber:newNumber})
//         }
//          return resolve({message:"Success Converted.", result: String(newNumber)});
//     });
// }
