using System;
using System.ComponentModel.DataAnnotations;

namespace _02_BO
{
    [AttributeUsage(AttributeTargets.Property |   AttributeTargets.Field, AllowMultiple = true)]
    class IdentificationNumberAttribute:ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value == null)
                return false;
            var idNumber = value.ToString();
            if (idNumber==null)
                return false;
            bool result = checkId(idNumber.PadLeft(9,'0'));
            return result;
        }
        public override string FormatErrorMessage(string name)
        {
            return $"Wrong Id number: {name}";
        }
        private bool checkId(string idNumber)
        {
            try
            {
                int sum = 0;
                bool flipper = false;
                for (var i = 0; i < 9; i++)
                {
                    var digit = int.Parse(idNumber[idNumber.Length - 1].ToString());
                    idNumber = idNumber.Substring(0, idNumber.Length - 1);
                    var factor = flipper ? 2 : 1;
                    flipper = !flipper;
                    var temp = factor * digit;
                    sum += sumDigits(temp);
                }
                return (sum % 10 == 0);
            }
            catch
            {
                return false;
            }
        }
        private int sumDigits(int number)
        {
            int sum = 0;
            while(number>0)
            {
                sum += number % 10;
                number = (number- number % 10)/10;
            }
            return sum;
        }
    }
}
