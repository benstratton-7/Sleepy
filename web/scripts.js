document.getElementById("LeagueIDform").addEventListener("submit", function(event) {
    event.preventDefault();
    var LeagueID = document.getElementById("LeagueID").value;

    // Store the LID in localStorage
    localStorage.setItem("LeagueID", LeagueID);

    // Redirect the user to the new page
    window.location.href = "app.html";
});