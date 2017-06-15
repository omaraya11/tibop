
<style>
p{padding:0;margin:0;font-family:"Times New Roman", serif;
letter-spacing: 1px; background-color: #EB81A9;margin-bottom:5px;margin-top:5px;}
legend{margin-top:10px;border:1px solid #444;padding:10px;margin-bottom:15px;background-color: #EB81A9;}
fieldset{width:250px;margin-left:20px;border:1px solid #444;padding:50px;}
</style>

<form action="mail.php" method="POST">
<fieldset>
<legend>Customer Information</legend>
<p>car number</p> <input type="text" name="car number">
<p>booking date</p> <input type="text" name="booking data">
<p>Payment method</p>
<select name="Payment method" size="1">
<option value=""></option>
<option value="cash">cash</option>
<option value="credit card">credit card</option>
</select>
<p>Email</p> <input type="text" name="Email"><br/>
<input type="submit" name="submit" value="confirm"/>

</fieldset>
<br />

<fieldset>
<legend>Notes</legend>

<ul>
<p><li>your booking will be cancelled in case of passage of 8hour from the start of booking.</li>
<li>we will send you an email to confirm the booking.</li>
<li> booking duration in hours,in days or in month</li></p></ul>

</fieldset>
</form>