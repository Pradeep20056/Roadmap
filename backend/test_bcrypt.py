import bcrypt

password = "test_password123"
# Hash it
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
hashed_str = hashed.decode("utf-8")
print(f"Hashed: {hashed_str}")

# Verify it
is_correct = bcrypt.checkpw(password.encode("utf-8"), hashed_str.encode("utf-8"))
print(f"Verification: {is_correct}")

if is_correct:
    print("SUCCESS: Bcrypt hashing and verification working correctly.")
else:
    print("FAILURE: Verification failed.")
